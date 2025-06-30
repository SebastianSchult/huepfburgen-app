import {
  CollectionReference,
  DocumentData,
  Firestore,
  collection,
} from '@angular/fire/firestore';

export function collectionWithRequiredConverter<T>(
  firestore: Firestore,
  path: string
): CollectionReference<T> {
  return collection(firestore, path) as CollectionReference<T>;
}