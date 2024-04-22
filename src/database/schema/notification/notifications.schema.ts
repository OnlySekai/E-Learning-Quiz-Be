import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class NotificationEntity {
  @Prop({
    required: true,
  })
  title: string;
  @Prop({
    required: true,
  })
  message: string;
  @Prop({
    required: true,
  })
  type: number;
  @Prop({
    required: true,
    default: false,
  })
  isRead: boolean;
  @Prop({
    default: '',
  })
  userId: string;
  @Prop({
    required: true,
    default: false,
  })
  forAdmin: boolean;
}

export const NotificationSchema =
  SchemaFactory.createForClass(NotificationEntity);
export type NotificationDocument = HydratedDocument<NotificationEntity>;
