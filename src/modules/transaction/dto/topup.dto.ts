import { IsInt, isInt, IsNotEmpty, Min } from "class-validator";

export class TopupDTO {
  @IsNotEmpty()
  @IsInt({ message: "amount hanya boleh angka " })
  @Min(1, { message: "amount tidak boleh lebih kecil dari 1" })
  top_up_amount!: number;
}
