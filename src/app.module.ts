import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './app/todo/todo.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'mysql',
        host: ConfigService.get('DB_HOST', 'localhost'), // 1° chave de valor, 2° Valor default
        port: Number(ConfigService.get('DB_PORT', 3306)),
        username: ConfigService.get('DB_USER', 'root'),
        password: '',
        database: ConfigService.get('DB_DATABASE', 'nest'),
        entities: [],
        synchronize: true,
      }),
    }),
    TodoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
