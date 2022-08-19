import React, { useEffect, useRef } from "react";

type Props = {
  className?: string;
  readOnly: boolean;
  children?: React.ReactNode;
  onSave: (value: string) => void;
  placeholder?: string;
  type: "text" | "html";
};
function Text({
  className,
  readOnly,
  onSave,
  placeholder,
  type,
  children,
}: Props) {
  const [isEditable, setIsEditable] = React.useState(false);
  const inputRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      let val;

      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        type === "text"
          ? (val = inputRef.current.innerText.replace(/<[^>]+>/g, ""))
          : (val = inputRef.current.innerHTML);

        onSave(val);
        setIsEditable(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onSave, type, children]);

  if (isEditable) {
    switch (type) {
      case "text":
        return (
          <p
            ref={inputRef}
            contentEditable
            suppressContentEditableWarning
            className={`mt-4 w-full border-2 border-gray-400 p-2 text-left text-sm  outline-none`}
          >
            {children}
          </p>
        );
      case "html":
        return (
          <p
            ref={inputRef}
            contentEditable
            suppressContentEditableWarning
            className={`mt-4 w-full border-2 border-gray-400 p-2 text-left text-sm  outline-none`}
            dangerouslySetInnerHTML={{
              __html: inputRef.current?.innerHTML || (children as string),
            }}
          />
        );
    }
  }

  if (!inputRef.current?.innerHTML && !children && !readOnly) {
    return placeholder ? (
      <p
        title="Click to set a value"
        onClick={() => {
          setIsEditable(true);
        }}
        className="mt-4 cursor-pointer  text-gray-400 transition-all hover:bg-gray-200"
      >
        {placeholder}
      </p>
    ) : null;
  }
  // readOnly === false
  if (!readOnly) {
    switch (type) {
      case "text":
        return (
          <div
            title="Click to edit"
            onClick={() => {
              setIsEditable(true);
            }}
            className={`${className} cursor-pointer transition-all hover:bg-gray-200 `}
          >
            {children}
          </div>
        );
      case "html":
        return (
          <div
            title="Click to edit"
            className={`${className} cursor-pointer transition-all hover:bg-gray-200 `}
            onClick={() => {
              setIsEditable(true);
            }}
            dangerouslySetInnerHTML={{
              __html: inputRef.current?.innerHTML || (children as string),
            }}
          />
        );
    }
  }

  // readOnly === true
  switch (type) {
    case "text":
      return <div className={className}>{children}</div>;
    case "html":
      return (
        <div
          className={className}
          dangerouslySetInnerHTML={{
            __html: children as string,
          }}
        />
      );
  }
}

export default Text;
