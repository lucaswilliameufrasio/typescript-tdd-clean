export class CachePolicy {
  private static MaxAgeInDays = 3;
  private constructor() {}

  static validate(timestamp: Date, spotDate: Date): boolean {
    const maxAge = new Date(timestamp);
    maxAge.setDate(maxAge.getDate() + CachePolicy.MaxAgeInDays);

    return maxAge > spotDate;
  }
}
