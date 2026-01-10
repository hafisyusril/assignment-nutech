import { IsInt, isInt, IsNotEmpty, Min } from "class-validator";

export class TopupDTO {
  @IsNotEmpty()
  @IsInt({ message: "amount hanya boleh angka " })
  @Min(0, { message: "amount tidak boleh lebih kecil dari 0" })
  top_up_amount!: number;
}
