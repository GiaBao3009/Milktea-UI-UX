/**
 * Convert File object to base64 buffer format for API
 */
export interface FileBuffer {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: string;
}

export const convertFileToBuffer = (file: File): Promise<FileBuffer> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            const result = reader.result?.toString() || '';
            // Extract base64 data (remove "data:mimetype;base64," prefix)
            const base64Data = result.split(',')[1] || '';
            
            resolve({
                fieldname: 'file',
                originalname: file.name,
                encoding: '7bit',
                mimetype: file.type,
                size: file.size,
                buffer: base64Data,
            });
        };
        
        reader.onerror = (error) => {
            reject(new Error(`Failed to read file: ${file.name}`));
        };
        
        reader.readAsDataURL(file);
    });
};

/**
 * Convert multiple files to buffer format
 */
export const convertFilesToBuffers = async (files: FileList | File[]): Promise<FileBuffer[]> => {
    const fileArray = Array.from(files);
    return Promise.all(fileArray.map(convertFileToBuffer));
};
