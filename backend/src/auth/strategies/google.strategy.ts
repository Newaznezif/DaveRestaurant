import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../services/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/v1/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: (err: any, user?: any) => void): Promise<void> {
    try {
      const user = await this.authService.handleSocialLogin({
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        avatar: profile.photos[0]?.value,
        provider: 'google',
        providerId: profile.id,
      });
      done(null, user);
    } catch (error) {
      done(error, undefined);
    }
  }
}