import path from "path";
import { writeFile,readFile } from "fs/promises";


const DATA_FILE = path.join("data","links.json");

export const  loadLinks = async ()=>{
    try {
        const data = await readFile(DATA_FILE,"utf-8");
        if(!data){
            return {};
        }
        return JSON.parse(data);
    } catch (error) {
        if(error.code === "ENOENT"){
            await writeFile(DATA_FILE,JSON.stringify({}));
            return {};
        }
        throw error;
    }
};

export const saveLinks = async (links)=>{
    await writeFile(DATA_FILE,JSON.stringify(links));
};