import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';
import { QuestionType } from '../../generated/prisma/enums.js';

const trim = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

/** Requires at least one option in the array to be marked as correct. */
function HasCorrectOption() {
  return (target: object, propertyName: string) => {
    registerDecorator({
      name: 'hasCorrectOption',
      target: target.constructor,
      propertyName,
      validator: {
        validate: (value: unknown) =>
          Array.isArray(value) &&
          value.some(
            (option: Partial<CreateOptionDto>) => option?.isCorrect === true,
          ),
        defaultMessage: (args: ValidationArguments) =>
          `${args.property} must contain at least one correct option`,
      },
    });
  };
}

export class CreateOptionDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  text: string;

  @IsBoolean()
  isCorrect: boolean;
}

export class CreateQuestionDto {
  @IsEnum(QuestionType)
  type: QuestionType;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  text: string;

  @ValidateIf((q: CreateQuestionDto) => q.type === QuestionType.BOOLEAN)
  @IsBoolean()
  booleanAnswer?: boolean;

  @ValidateIf((q: CreateQuestionDto) => q.type === QuestionType.INPUT)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  inputAnswer?: string;

  @ValidateIf((q: CreateQuestionDto) => q.type === QuestionType.CHECKBOX)
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  @HasCorrectOption()
  options?: CreateOptionDto[];
}

export class CreateQuizDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
