import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EncryptionService } from './encryption/encryption.service';
import { EncryptionController } from './encryption/encryption.controller';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EncryptionModule } from './encryption/encryption.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'user_crud',
      password: 'root',
      database: 'db_crud',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    EncryptionModule,
    MulterModule.register({
      dest: './uploads', // Directorio de destino para los archivos cargados
      limits: {
        fileSize: 10 * 1024 * 1024, // Limite de tamaño de archivo (10 MB)
      },
    }),
  ],
  controllers: [EncryptionController],
  providers: [EncryptionService],
})
export class AppModule {}
