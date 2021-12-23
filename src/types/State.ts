import {packagesType} from "@/types/Packages";

export interface RootState {
    packages: packagesType[] | [];
    error: string;
}