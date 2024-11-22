// import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//   canActivate(context: ExecutionContext) {
//     const request = context.switchToHttp().getRequest();
//     console.log('request',request)
//     const user = request.user;

//     if (user && user.is_blocked) {
//       throw new UnauthorizedException('Tài khoản của bạn đã bị khóa.');
//     }

//     // Gọi logic xác thực mặc định
//     return super.canActivate(context);
//   }

//  // Xử lý lỗi và trả về thông báo tùy chỉnh
//  handleRequest(err: any, user: any, info: any) {
//   if (info?.name === 'TokenExpiredError') {
//     throw new UnauthorizedException('Token của bạn đã hết hạn.');
//   }
//   if (!user) {
//     throw new UnauthorizedException('Token không hợp lệ.');
//   }
//   return user; // Trả về thông tin người dùng nếu hợp lệ
// }
// }
