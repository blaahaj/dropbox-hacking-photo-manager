import logRender from "@lib/logRender";
import * as React from "react";
import {
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import styles from "./editableTextField.module.css";

const EditableTextField = (props: {
  label?: string;
  value: string;
  onSave: (newValue: string) => Promise<void>;
  renderInactive?: (props: {
    value: string;
    placeholderText: string;
  }) => React.ReactNode;
}): React.ReactElement | null => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingValue, setEditingValue] = useState<string>(props.value.trim());
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && input.current) input.current.focus();
  }, [isEditing]);

  const { onSave } = props;
  const doSave = useMemo(
    () => (event: MouseEvent | KeyboardEvent) => {
      console.log("Saving");
      event.preventDefault();
      onSave(editingValue)
        .then(() => setIsEditing(false))
        .catch((err) => console.error(err));
    },
    [onSave, editingValue],
  );

  const doCancel = useMemo(
    () => (event: MouseEvent | KeyboardEvent) => {
      console.log("Stop editing");
      event.preventDefault();
      setIsEditing(false);
    },
    [],
  );

  const startEditing = useMemo(
    () => (event: MouseEvent | KeyboardEvent) => {
      event.stopPropagation();
      event.preventDefault();
      maybeStartEditing();
    },
    [],
  );

  const maybeStartEditing = () => {
    if (!isEditing) {
      console.log("Start editing");
      setEditingValue(props.value);
      setIsEditing(true);
    }
  };

  const onChange = useMemo(
    () => (e: ChangeEvent<HTMLInputElement>) => setEditingValue(e.target.value),
    [],
  );

  const onKeyDown = useMemo(
    () => (e: KeyboardEvent) => {
      if (e.key === "Enter") doSave(e);
      else if (e.key === "Escape") doCancel(e);
    },
    [doSave, doCancel],
  );

  const placeholderText = "(none)";

  return (
    <div className={styles.root}>
      {props.label && (
        <span className={styles.label} onClick={maybeStartEditing}>
          {props.label}:
        </span>
      )}
      {!isEditing ? (
        <span onClick={startEditing} className={styles.inactiveText}>
          {props.renderInactive ? (
            <div style={{ display: "inline-block" }}>
              {props.renderInactive({ value: props.value, placeholderText })}
            </div>
          ) : (
            props.value || placeholderText
          )}
        </span>
      ) : (
        <span className={styles.activeInputs}>
          <input
            ref={input}
            type={"text"}
            value={editingValue}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
          <input type={"submit"} value={"Save"} onClick={doSave} />
          <input type={"reset"} value={"Cancel"} onClick={doCancel} />
        </span>
      )}
    </div>
  );
};

export default logRender(EditableTextField);
