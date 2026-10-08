import { Input as ShadcnInput } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Input({ label, name, type = "text", textarea = false, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold">
      <span>{label}{(props.required || props["aria-required"]) && <span aria-hidden="true" className="ml-1 text-bahaya">*</span>}</span>
      {textarea ? (
        <Textarea name={name} rows={4} {...props} />
      ) : (
        <ShadcnInput name={name} type={type} {...props} />
      )}
    </label>
  );
}
