import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get('status')
    async getStatus() {
        return this.authService.getStatus();
    }

    @Post('setup')
    async setup(@Body() body: any) {
        return this.authService.setup(body.email, body.password);
    }

    @Post('login')
    async login(@Body() body: any) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new Error('Invalid credentials'); // Ideally returning 401 via Exception Filter or manual throw
        }
        return this.authService.login(user); // Actually Login logic usually handled by LocalAuthGuard but direct for now is simpler for bootstrap
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req: any) {
        return req.user;
    }
}
