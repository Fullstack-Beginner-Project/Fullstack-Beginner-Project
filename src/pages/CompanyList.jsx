import React from "react";
import Table from "../components/Table";
import Section from "../components/Section";
import Search from "../components/Search";
import Dropdown from "../components/Dropdown";
import GlobalNav from "../components/GlobalNav";
import "../assets/css/companylist.css";

function CompanyList() {

  const handleSearch = (keyword) => {
    console.log("검색어:", keyword);
  }

  const options = [
    "누적 투자금액 높은순", 
    "누적 투자금액 낮은순",
    "매출액 높은순",
    "매출액 낮은순",
    "고용 인원 많은순",
    "고용 인원 적은순",
  ]

  const sectionRight = (
    <form className="search_wrap_parent flex">
      <Search onSubmit={handleSearch}></Search>
      <Dropdown size={'small'} options={options}></Dropdown>
    </form>
  );
  return (
    <>
      <div className="content_wrap companylist_page">
        <Section title={'전체 스타트업 목록'} sh_right={sectionRight}>

          {/* section */}
          <Table></Table>
        </Section>

      </div>
      {/* pagnation 위치는 content_wrap안이 좋을지 밖이 좋을지 고려 */}
    </>
  );
}

export default CompanyList;