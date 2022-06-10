import * as yup from "yup";

const userSchema = yup.object().shape({
  name:  yup
  .string()
  .when("$showSignUp", (showSignUp, schema) => {
    if (showSignUp) {
      return schema.required();
    }
    return;
  }),
  email: yup.string().email("Invalid email").required(),
  password: yup.string().min(8).max(32).required().matches(/(?=.*[0-9])(?=.*[a-zA-Z])/, "One letter and one number required"),
});

export default userSchema;