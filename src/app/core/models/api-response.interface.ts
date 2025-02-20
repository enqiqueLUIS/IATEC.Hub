export interface SuintApiResponseInterface<T> {
    map(arg0: (block: any) => { label: any; value: any; }): import("../../features/restaurant-gustov/models/comboBoxOption.interface").ComboBoxOption[];
    data: T;
    isSuccess: boolean;
    statusCode: number;
    message: string;
    errors: Array<string>;
  }