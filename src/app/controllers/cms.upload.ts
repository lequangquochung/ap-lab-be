import { CMS, Post } from '$helpers/decorator';
import upload from '$middlewares/fileUpload';

@CMS('/upload')
export default class EmployeeController {

    @Post('', [upload.single('file')])
    async upload(req: any) {
        const file = req.file;
        return file.filename;
    }
}
