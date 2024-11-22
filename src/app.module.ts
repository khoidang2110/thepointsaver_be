import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ProductUpcModule } from './product_upc/product_upc.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';

@Module({
  imports: [
   
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
    }),
    ProductUpcModule,
    
  ], // khai báo module đối tượng khác
  controllers: [AppController],  //  định nghĩa API (endpoint,method)
  providers: [AppService], // địnhg nghĩa logic, tính toán
})
export class AppModule {}
