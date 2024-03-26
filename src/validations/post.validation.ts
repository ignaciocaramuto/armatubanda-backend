import yup from "yup";

const youtubeUrlRegex =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;

export const postSchema = yup.object({
  videoUrl: yup
    .string()
    .matches(youtubeUrlRegex, "El video proporcionado no es válido.")
    .required("El video es requerido."),
});
