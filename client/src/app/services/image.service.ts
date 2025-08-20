import { Injectable } from "@angular/core";
import { User } from "../models/user.model";




@Injectable({
  providedIn: 'root'
})



export class ImageService {

  getInputImages(props: {event: Event, numberOfFiles?: number, accept?: string[]}): File[] | null {
    let { event, numberOfFiles, accept } = props;
    if (!numberOfFiles) numberOfFiles = 1;
    const input = event.target as HTMLInputElement;
    let files = input.files ? Array.from(input.files) : null;
    if (files && accept) files = files.filter(file => accept.includes(file.type));
    if (files && numberOfFiles) files = files.slice(0, numberOfFiles);
    return files && files.length > 0 ? files : [];
  }

  isFileImage(file: File): boolean {
    const acceptedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    return acceptedImageTypes.includes(file.type);
  }

}