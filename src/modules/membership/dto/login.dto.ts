import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDTO {
  @IsEmail({}, { message: "Paramter email tidak sesuai format" })
  @IsNotEmpty({ message: "Email harus diisi" })
  email: string;

  @IsNotEmpty({ message: "Password harus diisi" })
  password: string;
}
