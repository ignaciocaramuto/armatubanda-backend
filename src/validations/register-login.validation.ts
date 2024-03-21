import yup from "yup";

export const registerLoginSchema = yup.object({
  email: yup
    .string()
    .email("El email proporcionado no es válido.")
    .required("El email es requerido."),
  password: yup.string().required("La contraseña es requerida."),
});
