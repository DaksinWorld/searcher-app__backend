import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BotDocument = BotModel & Document;

@Schema()
export class BotModel {
    @Prop({required: true})
    userId: string;

    @Prop({ required: true})
    createdAt: string;

    @Prop({ required: true })
    address: string;
}

export const BotSchema = SchemaFactory.createForClass(BotModel);
