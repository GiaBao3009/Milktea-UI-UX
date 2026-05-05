
// export interface IUserApplication {
//   user_id: number;
//   user_nm: string;
//   name: string;
//   email: string;
//   phone: string;
//   block: string;
//   token: string;
//   employee_id: number;
//   employee_code: string;
//   employee_name: string;
//   //screen?: IPermissions[];
// }
export class CookieUtils {

    static getCookieToken(): string | null {
        const cookies = document.cookie.split('; ');
        const tokenCookie = cookies.find(row => row.startsWith('token='));
        return tokenCookie ? tokenCookie.split('=')[1] : null;
    }

    static setCookieToken(token: string, timeExpired: string, domain = 'iam.chips.vn'): void {
        document.cookie = 'token' + '=' + token + '; path=/' + '; expires=' + timeExpired ;
    }

    static setCookieLanguage(language: string): void {
        console.log('Set cookie language:', language);
        document.cookie = 'language' + '=' + language;
    }

    static getCookieUser(): any {
        return this.getCookieToken();
    }

    
    static getCookie(name: string): string {
        return (document.cookie.split(name + '=')[1] || '').split(';')[0];
    }

    static clearCookie(): void {
        this.setCookieToken('', new Date(1999, 0, 0).toUTCString());
    }

    static clear(): void {
        CookieUtils.setCookieToken('', new Date(1999, 0, 0).toUTCString());
    }
}