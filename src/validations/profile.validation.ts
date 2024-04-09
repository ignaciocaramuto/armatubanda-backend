import yup from "yup";

const checkIfFilesAreCorrectType = (files?: File[]) => {
  let valid = true;
  if (files) {
    files.forEach((file) => {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        valid = false;
      }
    });
  }
  return valid;
};

export const profileSchema = yup.object({
  firstName: yup.string().required("El nombre es requerido."),
  lastName: yup.string().required("El apellido es requerido."),
  stageName: yup.string().required("El apodo es requerido."),
  country: yup.string().required("El país es requerido."),
  state: yup.string().required("El estado/provincia es requerido/a."),
  city: yup.string().required("La ciudad es requerida."),
  bio: yup.string().required("La biografía es requerida."),
  genres: yup.string().required("El género musical son requeridos."),
  instruments: yup.string().required("Los instrumentos son requeridos."),
  image: yup
    .array()
    .test(
      "is-correct-file",
      "El tipo de archivo es incorrecto",
      checkIfFilesAreCorrectType
    ),
  phoneNumber: yup.string(),
  birthday: yup.date(),
  webSite: yup.string(),
  socialMedia: yup.string(),
  career: yup.string(),
});
