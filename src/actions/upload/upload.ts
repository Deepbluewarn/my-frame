'use server'

import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { ImageInterface } from "@/interface/Upload";

export const UploadAction = async (metadata: ImageInterface[] | null, data: FormData) => {
    const files: File[] = [];
    data.forEach((value, key) => {
        if (key === 'file' && value instanceof File) {
            files.push(value);
        }
    });

    console.log(metadata);
    console.log(files);

    // if (!file || file.size <= 0) {
    //     return { success: false }
    // }

    // const bytes = await file.arrayBuffer()
    // const buffer = Buffer.from(bytes)

    // const path = join('./', 'tmp', file.name)
    // await writeFile(path, buffer)

    return { success: true }
};