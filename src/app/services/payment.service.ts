import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = environment.apiURL;

  token = sessionStorage.getItem('token');
  headers = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
  };

  constructor(private httpClient: HttpClient) { }

  canaraEncryptData(dataToEncrypt: any) {
    return this.httpClient.post(`${this.baseUrl}/api/v1/payment/canaraRequest`, dataToEncrypt, this.headers)
  }

  canaraPaymentRequest(encryptData: any) {
    const requestheaders = new HttpHeaders({
      'x-client-id': 'vgoGnm7RksBqlB1kP77m5QQVMAV9tTEB',
      'x-client-secret': 'aa0mlf2NGVkyvyWEVRKGCXtyXpaMkSPG',
      'x-client-certificate': 'MIIDBjCCAe4CCQCPxFe2jUJHFDANBgkqhkiG9w0BAQsFADBFMQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMB4XDTIzMTAyMDExMzU0NFoXDTI0MTAxOTExMzU0NFowRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoMGEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALeWpWM72j29SzSsHuFyGfd9U0Yu0n9jA7ADw/JIL0/+6iug/nNnVjDHgDvuLqBN/ZHelBuUzZYBZli5oWrJQitxaKLjM6jsgfTxJtF8ZEXWpMZ30qfZGO+0A6JGTawSRbx3zC3yZNRUYwxCrEe3e7NZK2Iy/Qa2PpB6SxkKmecc9kzKR0bWB+tYJBZ6EKca8Y93kSJ6WVkBGlKxhXBbEWjhwfj6xAHEYU9Oy1Rv3r5uAQtMRU0RQXqpYY2nRgxp6d7yHdHSd0T4//LNnIVFBHkkjPOY++yuSb0ei+5WIGt5KUEa6cYYVXKLuNic7lQafBkEls5cL48kP+Jo0aOwaV8CAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAl4qXqZRc74gHjC96couL1uCQ3Hdnf0EOlTFvBG3KH4Q1F5gvydXLTWRGldvtxAlIG2t/sNkQhSKJ1CIl62/PVrxTskCjjPQzbAbcBiRxdkoaEBE58csE/ZhCs/MLjcvorQygpkSBdwv65i7YUChIYKCiCna+r3CmE31J8/DimBg3Z6FJ6kGbH1uu8hvWbmn6O7NXGK4H6uYgVWFKMztRZ7PxsDyKf19w6hPoU1luy+OZROEyOOIZ+WkaGyXZTg2hbtC9uJ5hDdlrCp3UaxKKEE6p8jiNiptcqxAyJbcdaxVQGJXmvujR/A9CyLkfjvFvZ1qjWX6c4l6P1WadTrFiKQ==',
      'x-api-interaction-id': '0001',
      'x-timestamp': '1690890300',
      'x-signature': 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC3lqVjO9o9vUs0rB7hchn3fVNGLtJ/YwOwA8PySC9P/uoroP5zZ1Ywx4A77i6gTf2R3pQblM2WAWZYuaFqyUIrcWii4zOo7IH08SbRfGRF1qTGd9Kn2RjvtAOiRk2sEkW8d8wt8mTUVGMMQqxHt3uzWStiMv0Gtj6QeksZCpnnHPZMykdG1gfrWCQWehCnGvGPd5EiellZARpSsYVwWxFo4cH4+sQBxGFPTstUb96+bgELTEVNEUF6qWGNp0YMaene8h3R0ndE+P/yzZyFRQR5JIzzmPvsrkm9HovuViBreSlBGunGGFVyi7jYnO5UGnwZBJbOXC+PJD/iaNGjsGlfAgMBAAECggEANzJb11IPc7COA/Ab+LxNglNzzg4Vy6cBXNJE/3skfnCuByAIYLoY9+GDdIFQE3JfYpQBA6nhhdA17UciePC5rEYUp6SXy5oQGIzIlwNHQpgeQm2UMFLdZHRDA28Pu0RjIx8BjG7sUcptXSpOkeFgl7Ofj4609Gemt9mM6qJ9UzanhZtU0HjhPjpI229CfTknJv162C5XaxaMdZY6rmXm+uyEXVKwwgl2tOpNWqAQyDPZb2MFE8VYyyUlCvM/Wd0a9/7zhKDirFOGT/7h/Aqum8XnjlJ4OxGKJjnYI8t7JABCdUWSjDi3e/ZVvI7fhzjtOQBfLFH4xEDUCfGR43JXAQKBgQDgk1JWVyIGnWdVWs+H1Khpz8ffUc9NS2qjoTJ74X3m+D8Pa1HqfK6GI3dCzI1LuD1HJztIhhfiTRAVoz0J2EvniD0B6BPSA6lOGURMRpzE0vTB8Fev+/WMICKB6OHVqadPFlB4ONulaoJlMhPKOHNuqfAEINvpOJwt0FSnPxeHTwKBgQDRRxluB1O8Z6voihYIm5/k+sRavsZ982v1cb9EiO6Ous1SSFhSi+qbr59gjfJuvwlP74uuNzIqrtIl+hsbtVvKJU/T1lrftGT3wSW3AHEF4So9tKbCW6axCiv51m1XjFntbYTOqDf2Vjnyo3Yr0v5oJaCTWCciMMf9JJxg/9N48QKBgBcxH5+q/+iO+Mznw+bTH1FOE+YMHMxurWSYkQ4aC1Z+7IQ7IQqGNb/EidxsI2tea3Wdp5Glx3GnY7HYWcVagPw4JZS80s8tcZ6PHW6DHE13O6+LkoKqEoGWD/o6gpf+HTkdpNHFjWlXxn+M3F5V1hXnltHWUt+S6Q4SJavf6B4hAoGAdIDkQ0CI+SWtqfLVeU1JoiuIDAyQa6WLwEPmerzQMV0E2H21zZ5eqPUIALSE9eobwQhV9lJ79w8Dpmiplq9LvikvW3rFdCv02YgI+uuf/+ntnhRnkWN8VKqY+KjKjiZwGaESgglbviMad11Qd+0p+8iWr/AvOPV3IBG1jLpee8ECgYAn8usCYcgZXvN9ht3vtHQPCZ/7oGadbtf+VZxVStBe5nLqT7bsonwmw9o2blF77X3dUKzqtsT2KtyPg33o7KpG+ERuuASUs9jRPADNhCiaphqliYuqyCnVoSe5VjTdFx5FEqDRxEraqEcvDS9MUuDLoxXHJzKAxjZfsE9O++tDbg==',
      'Content-Type': 'application/json',
      'x-forwarded-for': '10.255.22.232',
    });

    const paymentRequest = {
      "srcAccountDetails": {
        "identity": "B001",
        "currency": "INR",
        "branchCode": "2774"
      },
      "destAccountDetails": {
        "identity": "B001",
        "currency": "INR"
      },
      "txnCurrency": "INR",
      "narration": "TC INTFR TC1 CA TO CA SAME CUSTOMER",
      "valueDate": "09-46-2022",
      "paymentMode": "N",
      "standingInstDetails": {
        "frequency": "1"
      },
      "encryptData": encryptData
    }

    return this.httpClient.post(`https://uat-apibanking.canarabank.in/uat/apib/payment/neft`, paymentRequest, { headers: requestheaders })
  }
}
