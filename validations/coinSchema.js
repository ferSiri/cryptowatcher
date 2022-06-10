import * as yup from "yup";

const coinSchema = yup.object().shape({
  cryptoName:  yup
  .string()
  .required("This field is required"),
  internalId:  yup
  .string()
  .required("This field is required")
});

export default coinSchema;