import { useForm } from "react-hook-form";
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";

export function useFormCabin(cabinToEdit, onCloseModal) {
  const { isCreating, createCabin } = useCreateCabin();
  const { isEditing, editCabin } = useEditCabin();
  const isWorking = isCreating || isEditing;
  const { id: editId, ...editValues } = cabinToEdit;

  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } =
    useForm({
      defaultValues: isEditSession ? editValues : {},
    });
  const { errors } = formState;

  function onSubmit(data) {
    const image =
      typeof data.image === "string" ? data.image : data.image[0];

    if (isEditSession) {
      editCabin(
        {
          newCabinData: { ...data, image: image },
          id: editId,
        },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
    } else {
      createCabin(
        { ...data, image: image },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
    }
  }

  function onError(errors) {
    // do something if error ocurred
  }

  return {
    isWorking,
    errors,
    register,
    handleSubmit,
    getValues,
    onSubmit,
    onError,
    isEditSession,
  };
}
