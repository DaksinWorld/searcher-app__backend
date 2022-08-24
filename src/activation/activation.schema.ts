import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ActivationDocument = ActivationModel & Document;

@Schema()
export class ActivationModel {
    @Prop({required: true})
    isActivated: boolean;

    @Prop({ required: true})
    createdAt: string;

    @Prop({required:true})
    hash: string;
}

export const ActivationSchema = SchemaFactory.createForClass(ActivationModel);
