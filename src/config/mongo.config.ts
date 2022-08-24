import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongoConfig = (
    configService: ConfigService,
): MongooseModuleOptions => {
    const uri = `mongodb+srv://${configService.get(
        'MONGO_LOGIN',
    )}:${configService.get('MONGO_PASSWORD')}@${configService.get(
        'MONGO_HOST',
    )}/?retryWrites=true&w=majority`;

    return {
        uri,
    };
};