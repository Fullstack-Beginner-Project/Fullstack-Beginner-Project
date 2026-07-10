import React from "react";
import Input from "../components/Input";
import Dropdown from "../components/Dropdown";

function CompanyList() {

  return (
  <>
    <a>테스트입니다.</a>
    <Dropdown size={"medium"} options={[1, 2, 3]} onChange={(value) => console.log(value)}/>
  </>
  );
}

export default CompanyList