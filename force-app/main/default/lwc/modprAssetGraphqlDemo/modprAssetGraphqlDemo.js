import { LightningElement, wire } from 'lwc';
import { gql, graphql } from 'lightning/uiGraphQLApi';

export default class ModprAssetGraphqlDemo extends LightningElement {
    // Account List
    accList = [];
    // Lead List
    leadList = [];
    errors;
    renderData;

     get columnsLead() {
        return [
            { label: 'Lead ID', fieldName: 'id' },
            { label: 'Lead Name', fieldName: 'name' },
        ];
    }

    // Processing Data in Getter, and showing it in DataTable, Comma Separted for Related Records.
    get accountData() {
        return this.accList.map((account) => {
            return {
                id: account.id,
                name: account.name,
                contactName: account.contacts.map((contact) => {
                    return contact.name;
                }).join(', '),
                oppName: account.opportunities.map((opportunity) => {
                    return opportunity.name;
                }).join(', '),
                caseNum: account.cases.map((casedetail) => {
                    return casedetail.caseNumber;
                }).join(', ')

            };
        });
    }

    // Columns to Show in Data Table
    get columns() {
        return [
            { label: 'Account ID', fieldName: 'id' },
            { label: 'Account Name', fieldName: 'name' },
            { label: 'Contacts Name', fieldName: 'contactName' },
            { label: 'Opportunities Name', fieldName: 'oppName' },
            { label: 'Case numbers', fieldName: 'caseNum' }
        ];
    }
    // Making GraphQL API call. Via Wire Adapter. we need to pass Query to the Server which tells server what exactly does the client need. 
    @wire(graphql, 
        {
        query: gql`
            query multipleObjectQuery {
                uiapi {
                    query {
                        Account {
                            edges {
                                node {
                                    Id
                                    Name {
                                        value
                                    }
                                    Contacts {
                                        edges {
                                            node {
                                                Id
                                                Name {
                                                    value
                                                }
                                            }
                                        }
                                    }
                                    Opportunities {
                                        edges {
                                            node {
                                                Id
                                                Name {
                                                    value
                                                }
                                            }
                                        }
                                    }
                                    Cases {
                                        edges {
                                            node {
                                                Id
                                                CaseNumber {
                                                    value
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        Lead {
                            edges {
                                node {
                                    Id
                                    Name {
                                        value
                                    }
                                }
                            }
                        }
                    }
                }
            }`
    })
    getmultipleObjectQuery({ data, errors }) {

        if(data) {
            // Getting and Processing Accounts.
            this.accList = data.uiapi.query.Account?.edges.map(acc=>{
                return {
                    id: acc.node.id,
                    name : acc.node.Name.value,
                    contacts : acc.node.Contacts?.edges.map(con=> {
                        return {
                            id: con.node.Id,
                            name : con.node.Name.value
                        }
                    }),
                    opportunities: acc.node.Opportunities?.edges.map((Opportunity) => {
                            return {
                                id: Opportunity.node.Id,
                                name: Opportunity.node.Name.value
                            };
                        }),
                    cases: acc.node.Cases?.edges.map((casedetail) => {
                            return {
                                id: casedetail.node.Id,
                                caseNumber: casedetail.node.CaseNumber.value
                            };
                    })
                }
            })
            // Getting Leads.
            this.leadList = data.uiapi.query.Lead?.edges.map(
                (lead) => {
                    return {
                        id: lead.node.Id,
                        name: lead.node.Name.value,
                    };
                }
            );
            this.renderData = true;
            this.errors = undefined;
        }
        else if(errors) {
            this.accList = undefined;
            this.errors = errors;
            this.renderData=false;
        }
    }





}