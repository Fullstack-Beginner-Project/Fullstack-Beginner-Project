import React from "react";
import "../assets/css/compareoverview.css";
import Dropdown from "../components/Dropdown.jsx";
import Section from "../components/Section";
import Table from "../components/Table.jsx";
import Pagination from "../components/Pagination.jsx";

function CompareOverview() {
  const handleSearch = (keyword) => {
    console.log("검색어:", keyword);
  }

  const options = [
    "나의 기업 선택 횟수 높은순", 
    "나의 기업 선택 횟수 낮은순",
    "실제 누적 투자 금액 높은순",
    "실제 누적 투자 금액 낮은순",
  ]

  const sectionRight = (
    <form className="search_wrap_parent flex">
      <Dropdown size={'medium'} options={options}></Dropdown>
    </form>
  );
  return (
    <>
      <div className="content_wrap">
        <Section title={'비교 현황'} sh_right={sectionRight}>

          {/*Table은 추후 DB 연동 간 수신 데이터 확인 후 map을 통해 구성할 예정*/}
          <Table></Table>

          <Pagination />
        </Section>

      </div>
      {/* pagnation 위치는 content_wrap안이 좋을지 밖이 좋을지 고려 */}
    </>
  );
}

export default CompareOverview;