/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'firebase/firestore' {
  export interface Firestore {
    type: string
    app: any
    toJSON(): object
  }

  export interface DocumentData {
    [field: string]: any
  }

  export interface DocumentReference<T = DocumentData> {
    id: string
    path: string
  }

  export interface CollectionReference<T = DocumentData> {
    id: string
    path: string
  }

  export interface DocumentSnapshot<T = DocumentData> {
    id: string
    exists(): boolean
    data(): T | undefined
  }

  export interface QuerySnapshot<T = DocumentData> {
    empty: boolean
    size: number
    docs: DocumentSnapshot<T>[]
    forEach(callback: (result: DocumentSnapshot<T>) => void): void
  }

  export function getFirestore(app?: any): Firestore
  export function collection(firestore: Firestore, path: string, ...pathSegments: string[]): CollectionReference
  export function doc(firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference
  export function doc(collection: CollectionReference, path?: string, ...pathSegments: string[]): DocumentReference
  export function getDoc(reference: DocumentReference): Promise<DocumentSnapshot>
  export function getDocs(query: any): Promise<QuerySnapshot>
  export function setDoc(reference: DocumentReference, data: any, options?: { merge?: boolean }): Promise<void>
  export function addDoc(reference: CollectionReference, data: any): Promise<DocumentReference>
  export function serverTimestamp(): any
  export function onSnapshot(reference: any, onNext: (snapshot: any) => void, onError?: (error: any) => void): () => void
}
