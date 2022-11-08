import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  readonly task: string;

  @IsNotEmpty()
  @IsIn([0, 1])
  readonly isDone: number;
}
