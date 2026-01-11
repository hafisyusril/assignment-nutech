import { IsEmail, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class RegisterDTO {
  @IsEmail({}, { message: "Paramter email tidak sesuai format" })
  @IsNotEmpty({ message: "Email harus diisi" })
  email: string;

  @MinLength(8, { message: "Password minimal harus 8 karakter" })
  @IsNotEmpty({ message: "Password harus diisi" })
  password: string;

  @MaxLength(50)
  @IsNotEmpty({ message: "First name harus diisi" })
  first_name: string;

  @MaxLength(50)
  @IsNotEmpty({ message: "Last name harus diisi" })
  last_name: string;
}
