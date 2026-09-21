import SubpoenasByOnlinePaymentType from "./SubpoenasByOnlinePaymentType";
import SubpoenasByOfflinePaymentType from "./SubpoenasByOfflinePaymentType";

export default function SubpoenaCharts() {
  return (
    <>
      <SubpoenasByOnlinePaymentType />
      <SubpoenasByOfflinePaymentType />
    </>
  );
}