import { useCallback, useState } from "react";
import { RequestByEmployeeParams, Transaction } from "../utils/types";
import { TransactionsByEmployeeResult } from "./types";
import { useCustomFetch } from "./useCustomFetch";

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch();
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<Transaction[] | null>(null);

  const fetchById = useCallback(
    async (employeeId: string) => {
      let data;
      if (employeeId === "all") {
        data = await fetchWithCache<Transaction[]>("allTransactions");
      } else if (employeeId) {
        data = await fetchWithCache<Transaction[], RequestByEmployeeParams>(
          "transactionsByEmployee",
          {
            employeeId,
          }
        );
      } else {
        // Set an appropriate state or handle the empty employeeId case here
        console.error("Employee ID is empty");
        return;
      }
      setTransactionsByEmployee(data);
    },
    [fetchWithCache]
  );

  const invalidateData = useCallback(() => {
    setTransactionsByEmployee(null);
  }, []);

  return { data: transactionsByEmployee, loading, fetchById, invalidateData };
}
