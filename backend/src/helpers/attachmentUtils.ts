import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

export class AttachmentUtils {
    constructor() {
        this.urlExpiration = process.env.SIGNED_URL_EXPIRATION
        this.bucketName = process.env.ATTACHMENT_S3_BUCKET
    }
    urlExpiration
    bucketName

    returnPresignedUrl = async (imageId: string) => {
        const S3 = new XAWS.S3({
            signatureVersion: 'v4'
        })
        const presignedUrl = await S3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: imageId,
            Expires: parseInt(this.urlExpiration)
        })
        return presignedUrl
    }

}