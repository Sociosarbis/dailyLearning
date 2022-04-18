## Aggregation
聚合还可以通过`aggs`属性添加多级的子聚合

### Bucket aggregation

### Filter
与搜索的`filter`语法一样，用以筛选需聚合的记录

#### Date histogram
以指定的时间间隔，对记录进行分组。

值类型：
```ts
type Bucket = {
  [name:string]: {
      date_histogram: {
          /** 以该字段作为分组凭据 */
          field: string
          calendar_interval?: string
          fixed_interval?: string
          /** key_as_string的格式 */
          format?: string
          /** 把时间转为该时区，会影响日历间隔的分组 */
          time_zone?: string
      }
  }  
}
```

### Terms
根据某个`field`对记录进行分组。

值类型：
```ts
type Bucket = {
    [name:string]: {
        terms: {
            [field:string]: string
        }
    }
}
```


### Metric aggregation

#### Sum
累加某个`field`的值。

值类型：
```ts
type Metric = {
    [name:string]: {
        sum: {
            field?: string
            /** 使用script的返回值来代替该记录的field值 */
            script?: string
        }
    }
}
```

## Query DSL

### Compound queries

#### Boolean query
可以由以下几种条件来组成。可以是它们的值可以是单个，也可以是数组。

##### must
必须满足的条件。

#### filter
必须满足的条件，但不会贡献相关分。
##### should
应该满足的条件，配合`minimum_should_match`，设置结果需满足`should`条款的数量和比重。

##### must not
不能满足的条件

### Full text queries

#### Match query
值类型。
```ts
type MatchQuery = {
    [field:string]: string
}
```

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
默认使用`Painless`作为脚本语言，类似`Java`，有一系列公共库供使用