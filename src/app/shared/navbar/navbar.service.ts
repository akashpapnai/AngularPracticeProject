import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginService } from "../../login.service";

@Injectable({
    providedIn: 'root'
})
export class NavbarService {
    constructor(private http: HttpClient, private lService: LoginService) { }
    private apiUrl = this.lService.__apiURL__;

    public async getAllPages(module: string, subModule: string): Promise<pages[]> {
        return new Promise<pages[]>((resolve) => {
            if (typeof localStorage !== 'undefined') {
                const allPagesResponse = this.http.get<pages[]>(this.apiUrl + '/Common/getPagesByModuleName', {
                    headers: new HttpHeaders({
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json',
                    }), params: {
                        module: module,
                        subModule: subModule
                    }
                });

                allPagesResponse.subscribe({
                    next: (x) => {
                        resolve(x);
                    },
                    error: (error) => {
                        console.error(error);
                    }
                });
            }
        });
    }
}

export interface pages {
    title: string;
    url: string;
}