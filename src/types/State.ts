import {packagesType} from "@/types/Packages";

export interface RootState {
    packages: packagesType[] | [];
    error: string;
    packagesFilter: string;
    packageInfo: any;
    packageInfoName: string;
    packageInfoLink: string;
    packageInfoError: string;
}