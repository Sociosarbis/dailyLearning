## Aggregation

### Bucket aggregation

#### Date histogram

### Terms

### Metric aggregation

#### Sum

## Query DSL

### Compound queries

#### Boolean

### Full text queries

### Match all
返回所有记录。

### Term-level queries

#### Exists
筛选出某个字段不为空的记录。
值类型：
```ts
type Exits = {
    field: string
}
```
#### Range
值类型：
```ts
type RangeValue = string | number
type Range = {
    [field:string]: {
        gt?: RangeValue
        gte?: RangeValue
        lt?: RangeValue
        lte?: RangeValue
    }
}
```

## Search your data

### Paginate search results

默认是返回前10条。可通过`from`和`size`两个参数来分页

### Retrieve selected fields from a search

#### The _source option
设置需返回的源数据字段。

值类型：
```ts
type SourceOption = boolean | string | string[] | { includes: string[], excludes: string[] }
```
支持使用**wildcard**，如`obj.*`表示`obj`属性以及它的子属性，`*.description`二级的`description`属性

#### Sort search results

排序除了`_score`外，其他属性按升序排。

`sort`的常用值类型：
```ts
type SortOption = string | { [field:string]: 'asc' | 'desc'  }
```


## Scripting