import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import * as crypto from 'crypto';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var AWS: any;

@Injectable({
  providedIn: 'root'
})
export class S3uploadService {

  private baseUrl = environment.apiURL;

  token = sessionStorage.getItem('token');
  headers = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
  };

  constructor(private http: HttpClient, private ngxLoader: NgxUiLoaderService) { }

  async s3Direct(file: File, fileName: string, key: string): Promise<string> {
    try {
      const credentials = await this.getAwsCredentials();
      console.log(credentials);
      this.ngxLoader.start();
      const s3 = new AWS.S3({
        accessKeyId: credentials.data.accessKeyId,
        secretAccessKey: credentials.data.secretKey,
        region: credentials.data.region
      });

      const generatedFileName = `${key}/` + this.generateFilename(file.type);

      const params = {
        Bucket: credentials.data.bucketName,
        Key: generatedFileName,
        Body: file
      };

      return new Promise((resolve, reject) => {
        s3.upload(params, (err: any, data: any) => {
          if (err) {
            this.ngxLoader.stop();
            console.error('Error uploading file:', err);
            reject(err);
          } else {
            this.ngxLoader.stop();
            console.log('File uploaded successfully:', data.Location);
            resolve(generatedFileName);
          }
        });
      });
    } catch (error) {
      console.error(`Error uploading ${fileName}:`, error);
      throw error;
    }
  }

  async getAwsCredentials(): Promise<any> {
    try {
      return await this.http.get<any>(`${this.baseUrl}/api/v1/bill/aws-credentials`, this.headers).toPromise();
    } catch (error) {
      console.error('Failed to fetch AWS credentials:', error);
      throw error;
    }
  }

  generateFilename(fileType: string): string {
    const currentDate = new Date().toLocaleString().replace(/[^\w\s]/gi, '').replace(/ /g, '_');
    const randomString = Math.random().toString(36).substr(2, 10); // Increase the length of the random string
    const extension = fileType.split('/').pop(); // Extract the file extension
    return `${currentDate}_${randomString}.${extension}`;
  }
}
