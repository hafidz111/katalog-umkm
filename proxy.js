import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function proxy(request) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  response.headers.set("Cache-Control", "private, no-store");
  const cookiesDiperbarui = new Map();
  const headersDiperbarui = new Map([["Cache-Control", "private, no-store"]]);

  function kembaliKeLogin() {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    const redirectResponse = NextResponse.redirect(url);
    for (const cookie of response.cookies.getAll()) {
      redirectResponse.cookies.set(cookie);
    }
    for (const header of ["cache-control", "expires", "pragma"]) {
      const value = response.headers.get(header);
      if (value) redirectResponse.headers.set(header, value);
    }
    return redirectResponse;
  }

  try {
    const url = process.env.SUPABASE_URL;
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !publishableKey) return kembaliKeLogin();

    const supabase = createServerClient(url, publishableKey, {
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers = {}) {
          for (const cookie of cookiesToSet) {
            request.cookies.set(cookie.name, cookie.value);
            cookiesDiperbarui.set(cookie.name, cookie);
          }
          // Teruskan cookie hasil refresh ke Server Component dan browser.
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesDiperbarui.values()) {
            response.cookies.set(name, value, options);
          }
          for (const [name, value] of Object.entries(headers)) {
            headersDiperbarui.set(name, value);
          }
          for (const [name, value] of headersDiperbarui) {
            response.headers.set(name, value);
          }
        },
      },
    });

    // Verifikasi pengguna ke Supabase; keberadaan cookie saja tidak cukup.
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return kembaliKeLogin();
    return response;
  } catch {
    // Jangan membuka halaman admin ketika layanan Auth gagal diverifikasi.
    return kembaliKeLogin();
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
