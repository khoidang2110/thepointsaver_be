import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(config: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: config.get('SECRET_KEY'),
//     });
//   }
//   async validate(decodedToken: any) {
//     console.log(decodedToken)
//     return decodedToken;
//   }
// }


export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: (req) => {
        // Lấy token từ header 'auth_token'
        return req.headers['auth_token'] || null;
      },
      ignoreExpiration: false,
      secretOrKey: config.get('SECRET_KEY'),
    });
  }

  async validate(decodedToken: any) {
    console.log(decodedToken); // In ra decoded token (lý tưởng là kiểm tra thông tin người dùng)
    return decodedToken;
  }
}
// lấy data của token