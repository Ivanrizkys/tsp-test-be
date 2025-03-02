export const takeUniqueOrThrow = (message: string) => {
  return <T>(values: T[]): T => {
    if (values.length !== 1) throw new Error(`Found non unique or inexistent value: ${message}`);
    return values[0]!;
  };
};
