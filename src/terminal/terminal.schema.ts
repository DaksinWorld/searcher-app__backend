import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TerminalDocument = TerminalModel & Document;

@Schema()
export class TerminalModel {
    @Prop({required: true})
    userId: string;

    @Prop()
    lastChange: number;

    @Prop()
    name: string
}

export const TerminalSchema = SchemaFactory.createForClass(TerminalModel);
