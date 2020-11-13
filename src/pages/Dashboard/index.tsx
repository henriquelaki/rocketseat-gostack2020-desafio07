/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react/jsx-indent */
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';
import Header from '../../components/Header';
import api from '../../services/api';
import { Card, CardContainer, Container, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const [response] = await Promise.all([api.get(`transactions`)]);

      const loadedTransactions: Transaction[] = response.data.transactions;
      const loadedBalance: Balance = response.data.balance;

      setTransactions(
        loadedTransactions.map(transaction => {
          return {
            ...transaction,
            created_at: new Date(transaction.created_at),
            formattedValue: `R$ ${transaction.value.toFixed(2).toString()}`,
            formattedDate: new Date(
              transaction.created_at,
            ).toLocaleDateString(),
          };
        }),
      );
      setBalance(loadedBalance);
    }
    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">
              <NumberFormat
                value={Number(balance.income)}
                displayType="text"
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
                prefix="R$ "
              />
            </h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              <NumberFormat
                value={Number(balance.outcome)}
                displayType="text"
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
                prefix="R$ "
              />
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">
              <NumberFormat
                value={Number(balance.total)}
                displayType="text"
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
                prefix="R$ "
              />
            </h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => {
                return (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      {transaction.type === 'income' ? (
                        <NumberFormat
                          value={Number(transaction.value)}
                          displayType="text"
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                          prefix="R$ "
                        />
                      ) : (
                        <NumberFormat
                          value={Number(transaction.value)}
                          displayType="text"
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                          prefix="- R$ "
                        />
                      )}
                    </td>
                    <td>{transaction.category.title}</td>
                    <td>{transaction.formattedDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
